import Image from "next/image"

export default function Logo() {
  return (
    <div className="absolute top-8 sm:top-12 w-40 h-40">
      <Image
        src="/logo-aviao.png"
        alt="Logo RampSync"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
