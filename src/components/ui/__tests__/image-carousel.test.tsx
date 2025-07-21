import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageCarousel, { CarouselSlideImage } from '../bilder-karussel'

describe('ImageCarousel', () => {
  const images: CarouselSlideImage[] = [
    { id: '1', public_url: '/img1.jpg', alt_text: 'Image 1' },
    { id: '2', public_url: '/img2.jpg', alt_text: 'Image 2' },
    { id: '3', public_url: '/img3.jpg', alt_text: 'Image 3' },
  ]

  test('navigation buttons change slides', async () => {
    const { container } = render(
      <ImageCarousel images={images} autoPlay={false} showIndicators={false} />,
    )

    expect(screen.getAllByAltText('Image 1')[0]).toBeInTheDocument()

    const nextButton = container.querySelector(
      'svg[data-lucide="chevron-right"]',
    )?.parentElement as HTMLElement
    const prevButton = container.querySelector(
      'svg[data-lucide="chevron-left"]',
    )?.parentElement as HTMLElement

    await userEvent.click(nextButton)
    expect(screen.getAllByAltText('Image 2')[0]).toBeInTheDocument()

    await userEvent.click(prevButton)
    expect(screen.getAllByAltText('Image 1')[0]).toBeInTheDocument()
  })

  test('autoplay advances slides over time', () => {
    jest.useFakeTimers()
    render(
      <ImageCarousel
        images={images}
        autoPlay
        autoPlayInterval={1000}
        showIndicators={false}
      />,
    )

    expect(screen.getAllByAltText('Image 1')[0]).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getAllByAltText('Image 2')[0]).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getAllByAltText('Image 3')[0]).toBeInTheDocument()
    jest.useRealTimers()
  })
})
