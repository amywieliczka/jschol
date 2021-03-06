// ##### Tab Author & Article Component ##### //
//
import React from 'react'
import { Link } from 'react-router'

class CitationComp extends React.Component {
  render() {
    return (
      <dl className="c-descriptionlist">
        {/* ToDo: Bring in all citations styles */}
        <dt><strong>APA</strong></dt>
        <dd>Citation here</dd>
      </dl>
    )
  }
}

class TabAuthorComp extends React.Component {
  render() {
    let p = this.props,
        authorList = p.authors.map(function(a, i) {return (
          // ToDo: Link to author 
          [<dt key={i}><a href="">{a.name}</a></dt>,
           <dd key={i+1}>{a.institution ? a.institution : ""}
            {a.email ? <span>&nbsp;&nbsp;&nbsp;{a.email}</span> : ""}</dd>]
        )}),
        issn = p.attrs['ext_journal'] && p.attrs['ext_journal']['issn'],
        peer_reviewed = p.attrs['is_peer_reviewed'] ? "True" : "False",
        permalink = "http://www.escholarship.org/uc/item/" + p.id,
        ezid = "http://ezid.cdlib.org/id/ark:/13030/qt" + p.id,
        appearsIn = p.appearsIn.map(function(node, i) {
          return ( <span key={i}><Link to={node.url}>{node.name}</Link><br/></span> )
        }),
        retrieved_suffix = ''
    if (p.attrs['orig_citation']) {
      let url = window.location.href.split('#')[0],
          date = p.formatDate(),
          r = "Retrieved " + date + ", from " 
      retrieved_suffix = <span>{r}<Link to="url">{url}</Link></span>
    }
    return(
      <div className="c-tabcontent">
      {!p.attrs['orig_citation'] &&
        <div className="c-itemactions">
          <div className="o-download">
            <button className="o-download__button">Download Citation</button>
            <details className="o-download__formats">
              <summary aria-label="formats"></summary>
              <ul className="o-download__single-menu">
                <li><a href="">RIS</a></li>
                <li><a href="">BibTex</a></li>
                <li><a href="">EndNote</a></li>
                <li><a href="">RefWorks</a></li>
              </ul>
            </details>
          </div>
        </div>
      }
        <h1 className="c-tabcontent__main-heading" tabIndex="-1">Author & Article Info</h1>
      {p.authors.length > 0 &&
        <details className="c-togglecontent" open>
          <summary>Author(s)</summary>
          <dl className="c-descriptionlist">
            {authorList}
          </dl>
        </details>
      }
        <details className="c-togglecontent" open>
          <summary>Citation</summary>
        {p.attrs['orig_citation'] ?
          <dl className="c-descriptionlist">
            <dt></dt><dd>{p.attrs['orig_citation']}&nbsp;&nbsp;{retrieved_suffix}</dd>
          </dl>
          :
          <CitationComp />
        }
        </details>
        <details className="c-togglecontent" open>
          <summary>Other information</summary>
          <dl className="c-descriptionlist">
          {issn && 
            [<dt key="0"><strong>ISSN</strong></dt>,
             <dd key="1">{issn}</dd>]
          }
          {p.campusID && 
            [<dt key="0"><strong>Campus</strong></dt>,
             <dd key="1"><Link to={"/uc/" + p.campusID}>{p.campusID}</Link></dd>]
          }
            <dt><strong>Peer-Reviewed</strong></dt>
            <dd>{peer_reviewed}</dd>
            <dt><strong>License</strong></dt>
            <dd>**************** TBD **************</dd>
            <dt><strong>Permalink</strong></dt>
            <dd><Link to={permalink}>{permalink}</Link></dd>
            <dt><strong>EZID Label Name</strong></dt>
            <dd><Link to={ezid}>{ezid}</Link></dd>
            <dt><strong>Dash Label Name</strong></dt>
            <dd>**************** TBD **************</dd>
            <dt><strong>Appears in</strong></dt>
            <dd>{appearsIn}</dd>
          </dl>
        </details>
      </div>
    )
  }
}

module.exports = TabAuthorComp;
