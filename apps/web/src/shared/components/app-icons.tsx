import Image from 'next/image';

type IconProps = {
  className?: string;
};

const iconClass = 'h-5 w-5';

export const GridIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const BellIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 2.5a4.5 4.5 0 0 0-4.5 4.5V9c0 .8-.3 1.6-.8 2.2L3.5 13h13l-1.2-1.8A4 4 0 0 1 14.5 9V7A4.5 4.5 0 0 0 10 2.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M8 15a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MenuIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BackArrowIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <path d="M4 6.5 8 10l4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SettingsIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M10 2.5c.6 0 1.2.3 1.5.9l.5 1c.2.3.5.5.9.6l1.1.2c1 .2 1.6 1.3 1.2 2.2l-.5 1c-.2.3-.2.7 0 1.1l.5 1c.5.9-.1 2-1.1 2.2l-1.1.2c-.4.1-.7.3-.9.6l-.5 1c-.5.9-1.8 1.2-2.6.5l-.9-.7c-.3-.2-.7-.2-1.1 0l-.9.7c-.8.7-2.1.4-2.6-.5l-.5-1c-.2-.3-.5-.5-.9-.6l-1.1-.2c-1-.2-1.6-1.3-1.1-2.2l.5-1c.2-.3.2-.7 0-1.1l-.5-1c-.5-.9.1-2 1.1-2.2l1.1-.2c.4-.1.7-.3.9-.6l.5-1c.3-.6.9-.9 1.5-.9h1.4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const DocSearchIcon = ({ className = 'h-[220px] w-[280px]' }: IconProps) => (
  <svg viewBox="0 0 280 220" fill="none" className={className} aria-hidden>
    <circle cx="132" cy="114" r="86" fill="#F2F2F2" />
    <rect x="84" y="64" width="94" height="120" rx="18" fill="#FDFDFD" stroke="#E4E4E4" />
    <rect x="100" y="82" width="42" height="10" rx="5" fill="#11263A" />
    <rect x="100" y="104" width="58" height="10" rx="5" fill="#D4D4D4" />
    <rect x="100" y="124" width="58" height="10" rx="5" fill="#D4D4D4" />
    <rect x="100" y="144" width="58" height="10" rx="5" fill="#D4D4D4" />
    <circle cx="176" cy="128" r="45" stroke="#CFC9DF" strokeWidth="12" />
    <path d="m208 160 29 29" stroke="#CFC9DF" strokeWidth="18" strokeLinecap="round" />
    <path d="m163 114 25 25m0-25-25 25" stroke="#FF4A4A" strokeWidth="12" strokeLinecap="round" />
    <circle cx="41" cy="170" r="6" fill="#3A7FB0" />
    <path d="M44 56c13-5 24-13 35-27" stroke="#11263A" strokeWidth="3" strokeLinecap="round" />
    <rect x="205" y="40" width="62" height="30" rx="8" fill="#F7F7F7" stroke="#E6E6E6" />
    <circle cx="220" cy="55" r="7" fill="#CFC9DF" />
    <rect x="232" y="48" width="25" height="14" rx="7" fill="#CFCFCF" />
    <path d="m96 184 8-8m0 8-8-8" stroke="#4E94C7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const VedaLogoMark = ({ className = 'h-[40px] w-[40px] rounded-[15px]' }: IconProps) => (
  <span className={`relative inline-flex shrink-0 overflow-hidden ${className}`} aria-hidden>
    <Image
      src="/assets/brand/veda-logo-mark.svg"
      alt=""
      width={80}
      height={71}
      className="absolute left-[-49.286%] top-[-4.638%] h-[177.5%] w-[200%] max-w-none"
    />
  </span>
);

export const CreateAssignmentArrowLeftIcon = ({ className = 'h-[24px] w-[24px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M14.5 6.5L9 12L14.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CreateAssignmentArrowRightIcon = ({ className = 'h-[24px] w-[24px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M9.5 6.5L15 12L9.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CreateAssignmentMicIcon = ({ className = 'h-[16.36px] w-[16.36px]' }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 12.5A2.8 2.8 0 0 0 12.8 9.7V6.2A2.8 2.8 0 0 0 7.2 6.2v3.5A2.8 2.8 0 0 0 10 12.5Z" fill="#303030" />
    <path d="M5.8 9.6a4.2 4.2 0 1 0 8.4 0M10 13.8V16.3M7.9 16.3h4.2" stroke="#303030" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SidebarSparklesIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
    <path d="M14 4.2 16.8 11.2 23.8 14 16.8 16.8 14 23.8 11.2 16.8 4.2 14 11.2 11.2 14 4.2Z" fill="white" />
    <path d="M20.8 3.8 21.7 6.3 24.2 7.2 21.7 8.1 20.8 10.6 19.9 8.1 17.4 7.2 19.9 6.3 20.8 3.8Z" fill="white" />
  </svg>
);

export const SidebarGroupsIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7" cy="8.2" r="1.2" fill="currentColor" />
    <path d="M4.8 13.2c.8-1.5 2-2.4 3.6-2.4 1.5 0 2.8.9 3.6 2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12.5 7.2h2.8M12.5 9.8h2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SidebarAssignmentsIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M6 2.8h5.6l3 3V16a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 16V4.6A1.8 1.8 0 0 1 6 2.8Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11.6 2.8V6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7.2 9.2h5.6M7.2 12h5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SidebarToolkitIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path d="M10 2.8 11.8 7.2 16.2 9 11.8 10.8 10 15.2 8.2 10.8 3.8 9 8.2 7.2 10 2.8Z" fill="currentColor" />
    <path d="M15.8 2.4 16.45 4.15 18.2 4.8 16.45 5.45 15.8 7.2 15.15 5.45 13.4 4.8 15.15 4.15 15.8 2.4Z" fill="currentColor" />
  </svg>
);

export const SidebarLibraryIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M7 2.8h4.9l3.3 3.3V16a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 16V4.6A1.8 1.8 0 0 1 7 2.8Z"
      fill="currentColor"
      fillOpacity="0.35"
    />
    <path d="M11.9 2.8V6h3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9.8v4M8 11.8h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SidebarSettingsIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M10 2.7c.6 0 1.1.3 1.3.8l.4.8c.2.3.5.5.8.5l.9.2c.9.2 1.4 1.1 1 1.9l-.4.8c-.2.3-.2.6 0 .9l.4.8c.4.8-.1 1.7-1 1.9l-.9.2c-.3.1-.6.2-.8.5l-.4.8c-.4.8-1.5 1-2.2.4l-.7-.5a1 1 0 0 0-1 0l-.7.5c-.7.6-1.8.4-2.2-.4l-.4-.8a1 1 0 0 0-.8-.5l-.9-.2c-.9-.2-1.4-1.1-1-1.9l.4-.8c.2-.3.2-.6 0-.9l-.4-.8c-.4-.8.1-1.7 1-1.9l.9-.2c.3-.1.6-.2.8-.5l.4-.8c.2-.5.7-.8 1.3-.8h1.2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const AssignmentsFilterIcon = ({ className = iconClass }: IconProps) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
    <path
      d="M3.5 5.75c0-.97.78-1.75 1.75-1.75h9.5c.97 0 1.75.78 1.75 1.75 0 .44-.16.86-.46 1.18l-3.44 3.76a1.75 1.75 0 0 0-.46 1.18v2.74a1.5 1.5 0 0 1-.76 1.3l-1.52.87A1.5 1.5 0 0 1 8 15.48v-3.61c0-.44-.16-.86-.45-1.18L3.95 6.93A1.75 1.75 0 0 1 3.5 5.75Z"
      stroke="#9A9A9A"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AssignmentsSearchIcon = ({ className = 'h-[22px] w-[22px]' }: IconProps) => (
  <svg viewBox="0 0 22 22" fill="none" className={className} aria-hidden>
    <circle cx="10" cy="10" r="6.5" stroke="#A7A7A7" strokeWidth="2" />
    <path d="M15 15L19 19" stroke="#A7A7A7" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DownloadIcon = ({ className = 'h-[24px] w-[24px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RegenerateIcon = ({ className = 'h-[20px] w-[20px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M20 12a8 8 0 1 1-2.34-5.66L20 8.68M20 4.8v3.88h-3.88"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FileUploadCloudIcon = ({ className = 'h-[24px] w-[25px]' }: IconProps) => (
  <svg viewBox="0 0 25 24" fill="none" className={className} aria-hidden>
    <path
      d="M16.5 16L12.5 12M12.5 12L8.5 16M12.5 12V21M20.89 18.39C21.865 17.8594 22.6359 17.0217 23.0816 16.0072C23.5274 14.9926 23.6226 13.858 23.3525 12.7832C23.0823 11.7083 22.4625 10.7532 21.5906 10.0697C20.7186 9.38625 19.6432 9.01484 18.535 9.013L17.275 9.013C16.9723 7.84266 16.4082 6.75517 15.6248 5.83313C14.8414 4.91109 13.8599 4.17824 12.7539 3.69009C11.6478 3.20194 10.4452 2.97059 9.23655 3.01398C8.02788 3.05738 6.84501 3.37436 5.77645 3.94075C4.7079 4.50713 3.78186 5.30719 3.06919 6.28115C2.35652 7.25511 1.87584 8.37984 1.66324 9.56823C1.45064 10.7566 1.51158 11.9779 1.84151 13.1393C2.17143 14.3008 2.76155 15.3711 3.565 16.27"
      stroke="#2B2B2B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CalendarPlusIcon = ({ className = 'h-[24px] w-[24px]' }: IconProps) => (
  <svg viewBox="0 0 20 19" fill="none" className={className} aria-hidden>
    <path
      d="M6.33333 1.58334V3.16668M13.6667 1.58334V3.16668M2.66667 6.33334H17.3333M9.08333 10.2917H6.33333M6.33333 13.4583H9.08333M14.875 11.0833V16.625M12.125 13.8542H17.625M5.96667 17.4167H14.0333C15.5735 17.4167 16.3436 17.4167 16.9318 17.117C17.4492 16.8534 17.8698 16.4329 18.1333 15.9155C18.433 15.3272 18.433 14.5572 18.433 13.017V6.56635C18.433 5.0262 18.433 4.25613 18.1333 3.66786C17.8698 3.15048 17.4492 2.72995 16.9318 2.46637C16.3436 2.16668 15.5735 2.16668 14.0333 2.16668H5.96667C4.42652 2.16668 3.65645 2.16668 3.06819 2.46637C2.5508 2.72995 2.13027 3.15048 1.86669 3.66786C1.567 4.25613 1.567 5.0262 1.567 6.56635V13.017C1.567 14.5572 1.567 15.3272 1.86669 15.9155C2.13027 16.4329 2.5508 16.8534 3.06819 17.117C3.65645 17.4167 4.42652 17.4167 5.96667 17.4167Z"
      stroke="#2B2B2B"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CounterMinusIcon = ({ className = 'h-[2px] w-[12px]' }: IconProps) => (
  <svg viewBox="0 0 12 2" fill="none" className={className} aria-hidden>
    <rect y="0.3333" width="12" height="1.3333" rx="0.6666" fill="currentColor" />
  </svg>
);

export const CounterPlusIcon = ({ className = 'h-[10px] w-[10px]' }: IconProps) => (
  <svg viewBox="0 0 10 10" fill="none" className={className} aria-hidden>
    <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DotsVerticalIcon = ({ className = 'h-[24px] w-[24px]' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="5" r="2" fill="#A7A7A7" />
    <circle cx="12" cy="12" r="2" fill="#A7A7A7" />
    <circle cx="12" cy="19" r="2" fill="#A7A7A7" />
  </svg>
);

export const CloseIcon = ({ className = 'h-[16px] w-[16px]' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    <path d="M4 4L12 12M12 4L4 12" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
