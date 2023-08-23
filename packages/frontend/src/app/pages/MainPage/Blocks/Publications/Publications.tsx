import 'swiper/css'
import 'swiper/css/pagination'
import './swiper.css'

import { Swiper, SwiperSlide } from 'swiper/react'

import { styled } from '../../../../../styles'
import BoxShadowed from '../../../../UIkit/BoxShadowed/BoxShadowed'
import Title from '../../components/SectionTitle/SectionTitle'
import { PublicationsData } from '../../helper/Publications/data'

export interface SlideProps {
  titleLogo: string
  tag: string
  text: string
  href: string
}

const PublicationsSection = styled('section', {
  marginBottom: '100px',
  '@lg': {
    marginBottom: '80px',
  },
  '@md': {
    marginBottom: '70px',
  },
  '@sm': {
    marginBottom: '60px',
  },
  '@xs': {
    marginBottom: '50px',
  },
})

const SlideLink = styled('a', {
  display: 'block',
  height: '100%',
  '&:hover': {
    p: {
      color: '$blue500',
    },
  },
})

const SlideHeader = styled('div', {
  padding: '20px 24px',
  background: 'linear-gradient(135deg, #028FFF 0%, #04E762 100%)',
  borderBottom: '2px solid #6B6F76',
  '@md': {
    padding: '18px 20px',
  },
})

const SlideIconTitle = styled('img', {
  display: 'block',
  height: '40px',
  width: 'auto',
  '@md': {
    height: '35px',
  },
})

const SlideContent = styled('div', {
  padding: '14px 24px 20px',
  '@xs': {
    padding: '14px 16px 20px',
  },
})

const SlideText = styled('p', {
  color: '$gray700',
  fontSize: '$primary2',
  fontWeight: '$primary',
  lineHeight: '142%',
  transition: 'all 0.2s ease-in-out',
})

const Publications = () => {
  const swiperSettings = {
    className: 'publications-slider',

    breakpoints: {
      100: {
        slidesPerView: 1.05,
        spaceBetween: 20,
      },
      200: {
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      401: {
        slidesPerView: 1.25,
      },
      501: {
        slidesPerView: 1.5,
      },
      601: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      899: {
        slidesPerView: 2.5,
        spaceBetween: 30,
      },
      1201: {
        slidesPerView: 3.5,
        spaceBetween: 35,
      },
      1537: {
        slidesPerView: 4,
        spaceBetween: 48,
      },
    },
  }

  return (
    <PublicationsSection>
      <Title>Publications</Title>

      <Swiper {...swiperSettings}>
        {PublicationsData.map((item, index) => {
          return (
            <SwiperSlide key={index} className="swiper-slide publications-slide">
              <BoxShadowed fullHeight large>
                <SlideLink href={item.href} target="_blank">
                  <SlideHeader>
                    <SlideIconTitle src={item.titleLogo} />
                  </SlideHeader>
                  <SlideContent>
                    <SlideText>
                      {item.text}
                    </SlideText>
                  </SlideContent>
                </SlideLink>
              </BoxShadowed>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </PublicationsSection>
  )
}

export default Publications
