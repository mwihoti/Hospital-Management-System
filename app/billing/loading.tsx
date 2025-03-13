export default function Loading () {
    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8">
            <div className="container mx-auto">
                <div className="animate-pulse ">
                    <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {Array(3)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-6 h-24"></div>
                            ))}
                    </div>
                    <div className="h-10 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {Array(3)
                            .fill(0)
                            .map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4 h-24"> </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}