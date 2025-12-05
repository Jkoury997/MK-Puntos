import Link from "next/link"
import { AlarmClock } from "lucide-react"

export default function Brand ({title}) {

    return (
        <div className="flex h-[60px] items-center px-6">
          
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <AlarmClock className="h-6 w-6" />
              <span className="">{title}</span>
            </Link>
        </div>
    )
}

function Package2Icon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
        <path d="M12 3v6" />
      </svg>
    )
  }
  