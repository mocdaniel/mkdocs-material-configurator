"use client"

import { useMobile } from "@/hooks/use-mobile"

export function BuyMeCoffee() {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="fixed bottom-[14px] right-20 z-10">
        <a
          href="https://www.buymeacoffee.com/dbodky"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy me a coffee"
          className="inline-block"
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Saved you time? Say thx!&emoji=&slug=dbodky&button_colour=5F7FFF&font_colour=ffffff&font_family=Bree&outline_colour=000000&coffee_colour=FFDD00"
            alt="Buy me a coffee button"
            className="h-10 shadow-lg rounded"
          />
        </a>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0">
      <a
        href="https://www.buymeacoffee.com/dbodky"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buy me a coffee"
        className="inline-block"
      >
        <img
          src="https://img.buymeacoffee.com/button-api/?text=Saved you time? Say thx!&emoji=&slug=dbodky&button_colour=5F7FFF&font_colour=ffffff&font_family=Bree&outline_colour=000000&coffee_colour=FFDD00"
          alt="Buy me a coffee button"
          className="h-12 shadow-lg rounded"
        />
      </a>
    </div>
  )
}

