interface ToggleProps {
  isToggled: boolean;
  onToggle: () => void;
  onText: string;
  offText: string;
}

export default function Toggle({
  isToggled,
  onToggle,
  onText,
  offText,
}: ToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={isToggled}
        onChange={onToggle}
      />
      <div
        className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
          isToggled ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-0 w-5 h-5 rounded-full bg-[#FDFDFD] transition-transform duration-200 ease-in-out ${
            isToggled ? "transform translate-x-5" : ""
          }`}
        />
      </div>
      <span className="ml-2 text-[#FDFDFD]">
        {isToggled ? onText : offText}
      </span>
    </label>
  );
}
