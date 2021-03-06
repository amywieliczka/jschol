// ##### Carousel Component ##### //

import React from 'react'
import PropTypes from 'prop-types'
import CarouselComp from '../components/CarouselComp.jsx'
import $ from 'jquery'
import { Link } from 'react-router'

// Load dotdotdot in browser but not server
if (!(typeof document === "undefined")) {
  const dotdotdot = require('jquery.dotdotdot')
}

class MarqueeComp extends React.Component {
  static propTypes = {
    unit: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      extent: PropTypes.object
    }).isRequired,
    marquee: PropTypes.shape({
      about: PropTypes.string,
      carousel: PropTypes.bool,
      slides: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string,
        image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        text: PropTypes.string,
        imagePreviewUrl: PropTypes.string
      }))
    })
  }

  componentDidMount() {
    if (this.aboutElement) {
      $(this.aboutElement).dotdotdot({
        watch: 'window',
        after: '.c-marquee__sidebar-more',
        callback: ()=> {
          $(this.aboutElement).find(".c-marquee__sidebar-more").click(this.destroydotdotdot)
        }
      })
      setTimeout(()=> $(this.aboutElement).trigger('update'), 0) // removes 'more' link upon page load if less than truncation threshold
    }
  }

  destroydotdotdot = event => {
    $(this.aboutElement).trigger('destroy')
    $(this.aboutElement).removeClass("c-marquee__sidebar-truncate")
    $(this.aboutElement).removeClass("o-columnbox__truncate1")
    $(this.aboutElement).find(".c-marquee__sidebar-more").hide()
  }

  render() {
      let about_block = this.props.marquee.about ?
        <div>
          <div dangerouslySetInnerHTML={{__html: this.props.marquee.about}}/>
          <button className="c-marquee__sidebar-more">More</button>
        </div>
        : null
    
    var slides = []
    if (this.props.marquee.slides) {
      slides = this.props.marquee.slides.map((slide, i) => {
        var imgUrl
        if (slide.imagePreviewUrl) {
          imgUrl = slide.imagePreviewUrl
          //for testing - amy used image urls in slide.image before she got upload working
          //seems useful so keeping this logic here
        } else if (slide.image && typeof slide.image === "string") {
          imgUrl = slide.image
        } else if (slide.image && slide.image.asset_id) {
          imgUrl = "/assets/" + slide.image.asset_id
        } else {
          imgUrl = ""
        }

        return (
          <div key={i} className="c-marquee__carousel-cell" style={{backgroundImage: "url('" + imgUrl + "')"}}>
            <h2>{slide.header}</h2>
            <p>{slide.text}</p>
          </div>
        )
      })
    }

    return (
      <div className="c-marquee">
        { this.props.marquee.carousel && this.props.marquee.slides &&
          <CarouselComp className="c-marquee__carousel" 
            truncate=".c-marquee__carousel-cell"
            options={{
              cellAlign: 'left',
              contain: true,
              initialIndex: 0,
              imagesLoaded: true
            }}>
            {slides}
          </CarouselComp>
        }
        { this.props.marquee.carousel && this.props.marquee.about &&
          <aside className="c-marquee__sidebar">
            <section className="o-columnbox2">
              <header>
                <h2>About</h2>
              </header>
              <div className="c-marquee__sidebar-truncate" ref={element => this.aboutElement = element}>
                {about_block}
              </div>
            </section>
          </aside>
        }
        { !this.props.marquee.carousel && this.props.marquee.about &&
          <section className="o-columnbox2">
            <header>
              <h2>About</h2>
            </header>
            <div className="o-columnbox__truncate1" ref={element => this.aboutElement = element}>
              {about_block}
            </div>
          </section>
        }
      </div>
    )
  }
}

module.exports = MarqueeComp;
