import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function RoleButton({
    href,
    children,
    className = "",
    allowedRoles = [],
    disabledMessage = "You don't have permission to perform this action",
    ...props
}) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const isAllowed =
        allowedRoles.length === 0 ||
        allowedRoles.some(
            (role) => userRole.toLowerCase() === role.toLowerCase()
        );

    if (!isAllowed) {
        return (
            <div className="relative inline-block group">
                <button
                    disabled
                    className={`${className} opacity-50 cursor-not-allowed`}
                    {...props}
                >
                    {children}
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {disabledMessage}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-red-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    );
}
