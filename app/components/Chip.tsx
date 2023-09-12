type chipProps = {
  value: 25 | 50 | 100 | 500;
  onBet?: (bet: 25 | 50 | 100 | 500) => void;
}

export function Chip({ value, onBet }: chipProps) {
  const style = (() => {
    switch(value) {
      case 25: {
        return {
          fill: 'fill-red-600',
          bg: 'bg-red-900'
        }
      }
      case 50: {
        return {
          fill: 'fill-green-600',
          bg: 'bg-green-900'
        }
      }
      case 100: {
        return {
          fill: 'fill-yellow-600',
          bg: 'bg-yellow-900'
        }
      }
      case 500: {
        return {
          fill: 'fill-fuchsia-600',
          bg: 'bg-fuchsia-900'
        }
      }
    }
  })();


  if (!onBet) return (
    <div className="relative rounded-full w-9 h-9 hover:-mt-2 cursor-pointer shadow-lg">
      <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 rounded-full ${style.bg}`}></span>
      <div className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          width="36" 
          height="36" 
          viewBox="0 0 24 24"
          className="z-20"
        >
          <path className={style.fill} fill="currentColor" d="M23 12c0 6.08-4.92 11-11 11S1 18.08 1 12S5.92 1 12 1s11 4.92 11 11M13 4.06c2.13.27 4.07 1.39 5.37 3.1l1.74-1A10 10 0 0 0 13 2v2.06m-9.11 2.1l1.74 1A8.022 8.022 0 0 1 11 4.06V2a10 10 0 0 0-7.11 4.16m-1 9.94l1.73-1a8.03 8.03 0 0 1 0-6.2l-1.73-1a9.864 9.864 0 0 0 0 8.2M11 19.94a8.022 8.022 0 0 1-5.37-3.1l-1.74 1A10 10 0 0 0 11 22v-2.06m9.11-2.1l-1.74-1a8.022 8.022 0 0 1-5.37 3.1v2c2.85-.29 5.44-1.78 7.11-4.1m1-1.74c1.19-2.6 1.19-5.6 0-8.2l-1.73 1a8.03 8.03 0 0 1 0 6.2l1.73 1M15" />
        </svg>
      </div>
      <span className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">{value}</span>
    </div>
  );

  return (
    <div className="relative rounded-full w-16 h-16 hover:-mt-2 cursor-pointer shadow-lg" onClick={() => onBet(value)}>
      <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 rounded-full ${style.bg}`}></span>
      <div className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24"
          className="z-20"
        >
          <path className={style.fill} fill="currentColor" d="M23 12c0 6.08-4.92 11-11 11S1 18.08 1 12S5.92 1 12 1s11 4.92 11 11M13 4.06c2.13.27 4.07 1.39 5.37 3.1l1.74-1A10 10 0 0 0 13 2v2.06m-9.11 2.1l1.74 1A8.022 8.022 0 0 1 11 4.06V2a10 10 0 0 0-7.11 4.16m-1 9.94l1.73-1a8.03 8.03 0 0 1 0-6.2l-1.73-1a9.864 9.864 0 0 0 0 8.2M11 19.94a8.022 8.022 0 0 1-5.37-3.1l-1.74 1A10 10 0 0 0 11 22v-2.06m9.11-2.1l-1.74-1a8.022 8.022 0 0 1-5.37 3.1v2c2.85-.29 5.44-1.78 7.11-4.1m1-1.74c1.19-2.6 1.19-5.6 0-8.2l-1.73 1a8.03 8.03 0 0 1 0 6.2l1.73 1M15" />
        </svg>
      </div>
      <span className="z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-md font-bold text-white">{value}</span>
    </div>
  )
} 