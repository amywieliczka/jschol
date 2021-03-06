// ##### Rights Component ##### //

import React from 'react'

class RightsComp extends React.Component {
  render() {
    let r = this.props.rights,
        size = this.props.size,
        baseURL = "https://creativecommons.org",
        lv = "4.0",
        rightsMap = {
        'public':      [`${baseURL}/publicdomain/zero/1.0/`,   `cc-zero-${size}.svg`,     "CC0 1.0 Universal (Public Domain)"],
        'CC BY':       [`${baseURL}/licenses/by/${lv}/`,       `cc-by-${size}.svg`,       "Attribution 4.0 International Public License"],
        'CC BY-NC':    [`${baseURL}/licenses/by-nc/${lv}/`,    `cc-by-nc-${size}.svg`,    "Attribution-NonCommercial 4.0 International Public License"],
        'CC BY-NC-ND': [`${baseURL}/licenses/by-nc-nd/${lv}/`, `cc-by-nc-nd-${size}.svg`, "Attribution-NonCommercial-NoDerivatives 4.0 International Public License"],
        'CC BY-NC-SA': [`${baseURL}/licenses/by-nc-sa/${lv}/`, `cc-by-nc-sa-${size}.svg`, "Attribution-NonCommercial-ShareAlike 4.0 International Public License"],
        'CC BY-ND':    [`${baseURL}/licenses/by-nd/${lv}/`,    `cc-by-nd-${size}.svg`,    "Attribution-NoDerivatives 4.0 International Public License"],
        'CC BY-SA':    [`${baseURL}/licenses/by-sa/${lv}/`,    `cc-by-sa-${size}.svg`,    "Attribution-ShareAlike 4.0 International Public License"] },
          a = rightsMap[r],
          altText = "Creative Commons "
    return (
      <a href={a[0]} className="c-publocation__license"><img src={"/images/"+a[1]} alt={altText + a[2]} /></a>
    )
  }

}

module.exports = RightsComp;
