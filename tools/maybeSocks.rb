#!/usr/bin/env ruby

require 'socket'
require 'yaml'

verbose = ARGV.delete('-v') || ARGV.delete('--verbose')

# If there's no socks config, definitely don't start socks.
if !File.exist? "config/socks.yaml"
  verbose and puts "No SOCKS proxy configured, so not starting one."
  exit(0)
end

# See if there's already a proxy listening on the specified port
CONFIG_FILE = "config/socks.yaml"
config = YAML.load_file(CONFIG_FILE)
port = config['port'].to_i
port or raise("Error: no port configured in ${CONFIG_FILE}.")
begin
  s = TCPSocket.open("127.0.0.1", port)
  s.close()
  verbose and puts "SOCKS proxy already running on port #{port}."
  exit(0)
rescue
  # ok, good, we can't connect
end

# Fire up a proxy, optionally overriding username
puts "\nStarting SOCKS proxy."
user = config['user'] ? "#{config['user']}@" : ""
pid = spawn("ssh -N -D #{port} " +
	          "-F /dev/null " +
            "-o ProxyCommand='ssh -C -W %h:%p -p 18822 #{user}cdl-aws-bastion.cdlib.org' " +
            "-o CheckHostIP=no " +
            "#{user}pub-jschol-dev.escholarship.org")
Process.detach(pid)
