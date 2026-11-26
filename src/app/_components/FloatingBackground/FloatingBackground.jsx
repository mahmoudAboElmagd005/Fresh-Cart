import { FaAppleWhole, FaCarrot, FaLemon, FaSeedling } from "react-icons/fa6";

const floatingIcons = [
  {
    Icon: FaAppleWhole,
    className:
      "top-[10%] left-[5%] text-4xl text-green-200 animate-[float_6s_ease-in-out_infinite]",
  },
  {
    Icon: FaCarrot,
    className:
      "top-[20%] right-[10%] text-3xl text-green-200 animate-[float_8s_ease-in-out_infinite_1s]",
  },
  {
    Icon: FaLemon,
    className:
      "bottom-[25%] left-[8%] text-3xl text-green-200 animate-[float_7s_ease-in-out_infinite_0.5s]",
  },
  {
    Icon: FaSeedling,
    className:
      "bottom-[15%] right-[15%] text-4xl text-green-200 animate-[float_9s_ease-in-out_infinite_2s]",
  },
  {
    Icon: FaAppleWhole,
    className:
      "top-[50%] left-[15%] text-2xl text-green-100 animate-[float_5s_ease-in-out_infinite_1.5s]",
  },
  {
    Icon: FaCarrot,
    className:
      "top-[40%] right-[5%] text-2xl text-green-100 animate-[float_6s_ease-in-out_infinite_0.8s]",
  },
];

export default function FloatingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {floatingIcons.map(({ Icon, className }, index) => (
        <div
          key={index}
          className={`absolute motion-reduce:animate-none ${className}`}
        >
          <Icon />
        </div>
      ))}

      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-linear-to-bl from-green-100/40 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-linear-to-tr from-green-100/30 to-transparent blur-3xl" />
    </div>
  );
}
