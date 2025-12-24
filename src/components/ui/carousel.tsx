'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  alt: string;
}

export function Carousel({ images, alt }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full h-48 bg-muted">
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 bg-muted group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {canScrollPrev && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4 text-black" />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scrollNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4 text-black" />
        </button>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              emblaApi?.scrollTo(index);
            }}
            className={`rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-white w-4 h-1.5'
                : 'bg-white/60 hover:bg-white/80 w-1.5 h-1.5'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
