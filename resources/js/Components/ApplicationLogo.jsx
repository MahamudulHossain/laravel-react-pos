export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect width="40" height="40" rx="10" fill="#059669" />
            <path
                d="M10 26V14h4.2c2.4 0 3.9 1.4 3.9 3.5 0 2.2-1.5 3.6-3.9 3.6H12.4V26H10zm2.4-6.4h1.6c1.2 0 1.9-.7 1.9-1.7s-.7-1.6-1.9-1.6h-1.6v3.3zM20.2 26V14h6.8v2.1h-4.4v2.7h4.1v2.1h-4.1V26h-2.4z"
                fill="white"
            />
        </svg>
    );
}
