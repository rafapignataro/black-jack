type PlayerTimerProps = {
  size?: number;
  value?: number;
  max?: number;
  strokeWidth?: number;
  className?: string;
}

export function PlayerTimer({
  size = 200,
  value = 25,
  max = 100,
  strokeWidth = 5,
  className
}: PlayerTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - dashArray * value / max;

  return (
    <svg width={size} height={size} viewBox={viewBox} className={className}>
      <circle
        fill="none"
        stroke="red"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        className="transition-all duration-1000" 
      />
      <circle
        fill="none"
        stroke="white"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-[2500]"
      />
    </svg>
  );
}
