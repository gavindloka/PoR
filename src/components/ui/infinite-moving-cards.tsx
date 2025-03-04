import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./card";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!scrollerRef.current || start) return;

    const scroller = scrollerRef.current;
    const children = Array.from(scroller.children);
    children.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true"); 
      scroller.appendChild(clone);
    });

    updateAnimationProps();
    setStart(true);
  }, []);

  const updateAnimationProps = () => {
    if (!containerRef.current) return;

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    const duration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    containerRef.current.style.setProperty("--animation-duration", duration);
  };

  return (
    <div
      ref={containerRef}
      className={
        "relative z-20 max-w-[80rem] overflow-hidden font-manrope border-0 rounded-2xl"}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li key={idx} className="w-[350px] max-w-full flex-shrink-0 md:w-[450px] h-full">
            <Card className="bg-purple-50 border border-purple-100 shadow-sm rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border-2 border-purple-200">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-purple-900">{item.name}</p>
                    <p className="text-sm text-purple-600">{item.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 italic">{item.quote}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>  
  );
};
