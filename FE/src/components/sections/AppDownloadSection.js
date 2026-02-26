const AppDownloadSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Download Our Mobile App</h2>
            <p className="text-gray-600 mb-6">
              Get the JustSearch app for faster searching and exclusive deals on local services.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
                <span className="mr-2">🍎</span>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
                <span className="mr-2">🤖</span>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="/images/mobileapp.png" alt="Mobile App" className="h-64 object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownloadSection
