export default function Loading() {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-8">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>
  
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
  
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white rounded-lg shadow-sm h-[600px]"></div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm h-[600px]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  