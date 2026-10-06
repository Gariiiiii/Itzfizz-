"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const textRef = useRef(null);

  const boxRefs = useRef([]);

  const letters = "WELCOME ITZFIZZ".split("");

  const stats = [
    {
      value: "58%",
      text: "Increase in pick up point use",
      position: "top-5 right-1/4",
      delay: 0.25,
    },
    {
      value: "23%",
      text: "Decreased in customer phone calls",
      position: "bottom-5 right-[35%]",
      delay: 0.42,
    },
    {
      value: "27%",
      text: "Increase in pick up point use",
      position: "top-5 right-10",
      delay: 0.6,
    },
    {
      value: "40%",
      text: "Decreased in customer phone calls",
      position: "bottom-5 right-12",
      delay: 0.78,
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const car = carRef.current;
    const trail = trailRef.current;

    if (!section || !track || !car || !trail) return;

    const ctx = gsap.context(() => {


      const carWidth = car.getBoundingClientRect().width;
const roadWidth = track.getBoundingClientRect().width;

const carEndX = roadWidth - carWidth / 2;
const trailEndX = carEndX + 100;

      // Initial positions
      gsap.set(car, {
        x: 0,
      });

      gsap.set(trail, {
        width: 75,
      });

      gsap.set(boxRefs.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(textRef.current?.children, {
        opacity: 0,
        y: 15,
      });

      // MAIN TIMELINE
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=830",
          scrub: 1,
          pin: track,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 🚗 CAR MOVEMENT
      mainTimeline.to(
        car,
        {
          x: carEndX,
          ease: "none",
          duration: 1,
        },
        0,
      );

      // 🟢 GREEN TRAIL
      mainTimeline.to(
        trail,
        {
          width: trailEndX,
          ease: "none",
          duration: 1,
        },
        0,
      );

      // WELCOME ITZFIZZ
      const letterElements = textRef.current?.children;

      if (letterElements) {
        mainTimeline.to(
          letterElements,
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "power2.out",
            duration: 0.25,
          },
          0.05,
        );
      }

      // STATS
      stats.forEach((stat, index) => {
        mainTimeline.to(
          boxRefs.current[index],
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.2,
          },
          stat.delay,
        );
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);
  return (
    <main className="min-h-screen w-full bg-[#d1d1d1] font-sans text-neutral-900">
      {/* Main scroll section */}
      <section ref={sectionRef} className="relative min-h-[200vh] w-full">
        {/* Pinned track */}
        <div
          ref={trackRef}
          className="relative flex h-screen w-full items-center overflow-visible"
        >
          {/* Road */}
          <div className="absolute left-0 top-1/2 h-50 w-full -translate-y-1/2 overflow-hidden bg-neutral-900">
            {/* GREEN TRAIL */}
            <div
              ref={trailRef}
              className="pointer-events-none absolute inset-y-0 left-0 z-0 bg-[#45db7d]"
            />

            {/* WELCOME TEXT */}
            <div
              ref={textRef}
              className="pointer-events-none absolute left-[43%] top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap text-9xl font-bold text-neutral-900"
            >
              {letters.map((letter, index) => (
                <span
                  key={index}
                  className="inline-block opacity-0 will-change-transform"
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </div>

            {/* CAR — MUST BE ABOVE BOTH TRAILS */}
            <Image
              ref={carRef}
              src="/car.png"
              alt="car"
              width={300}
              height={200}
              priority
              className="absolute left-0 top-1/2 z-20 h-50 w-auto -translate-y-1/2 object-contain will-change-transform"
            />
          </div>
          {/* Stat boxes */}
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              ref={(element) => {
                boxRefs.current[index] = element;
              }}
              className={`absolute z-30 flex w-48 flex-col gap-1 text-xs leading-snug opacity-0 will-change-transform ${stat.position} max-md:w-36 max-md:text-[11px] max-sm:w-28 max-sm:text-[9px]`}
            >
              <span className="text-4xl font-bold leading-none max-md:text-2xl max-sm:text-xl">
                {stat.value}
              </span>

              <span>{stat.text}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
