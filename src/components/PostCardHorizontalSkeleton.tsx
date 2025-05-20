export default function PostCardHorizontalSkeleton() {
    return (
        <div className="flex gap-4 animate-pulse">
            <div className="w-40 h-28 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}
