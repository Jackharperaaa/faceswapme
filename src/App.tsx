import React, { useState } from 'react';
import { Upload, Sparkles, Download, Moon, Sun } from 'lucide-react';

interface GifData {
  id: string;
  url: string;
  title: string;
}

function App() {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [selectedGif, setSelectedGif] = useState<GifData | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gifs, setGifs] = useState<GifData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'target') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'user') {
        setUserImage(file);
      } else {
        setTargetImage(file);
        setSelectedGif(null); // Clear GIF selection when uploading target image
      }
    }
  };

  const searchGifs = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Mock GIF data for demo purposes
      const mockGifs: GifData[] = [
        {
          id: '1',
          url: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
          title: 'Happy Person'
        },
        {
          id: '2',
          url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
          title: 'Smiling Face'
        },
        {
          id: '3',
          url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
          title: 'Portrait'
        }
      ];
      setGifs(mockGifs);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectGif = (gif: GifData) => {
    setSelectedGif(gif);
    setTargetImage(null); // Clear target image when selecting GIF
  };

  const processImages = async () => {
    if (!userImage || (!selectedGif && !targetImage)) return;

    setIsProcessing(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, show the target image/GIF as result
      if (selectedGif) {
        setResult(selectedGif.url);
      } else if (targetImage) {
        const imageUrl = URL.createObjectURL(targetImage);
        setResult(imageUrl);
      }
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = 'face-swap-result.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetApp = () => {
    setUserImage(null);
    setSelectedGif(null);
    setTargetImage(null);
    setResult(null);
    setGifs([]);
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
      } backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FaceGIF
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* User Image Upload */}
              <div className={`p-6 rounded-xl border-2 border-dashed transition-colors ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Your Photo
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'user')}
                  className="hidden"
                  id="user-upload"
                />
                <label
                  htmlFor="user-upload"
                  className="block cursor-pointer"
                >
                  {userImage ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(userImage)}
                        alt="User upload"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm opacity-75">{userImage.name}</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Upload your photo</p>
                      <p className="text-sm opacity-75">Click or drag to select</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Target Selection */}
              <div className={`p-6 rounded-xl border-2 border-dashed transition-colors ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-800/50' 
                  : 'border-gray-300 bg-white'
              }`}>
                <h2 className="text-xl font-semibold mb-4">Target Selection</h2>
                
                {/* GIF Search */}
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search GIFs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && searchGifs()}
                    />
                    <button
                      onClick={searchGifs}
                      disabled={isSearching}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>

                {/* GIF Results */}
                {gifs.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {gifs.map((gif) => (
                      <button
                        key={gif.id}
                        onClick={() => selectGif(gif)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedGif?.id === gif.id
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-transparent hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={gif.url}
                          alt={gif.title}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* OR Divider */}
                <div className="flex items-center my-4">
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <span className="px-3 text-sm opacity-75">OR</span>
                  <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                </div>

                {/* Target Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'target')}
                  className="hidden"
                  id="target-upload"
                />
                <label
                  htmlFor="target-upload"
                  className="block cursor-pointer"
                >
                  {targetImage ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(targetImage)}
                        alt="Target upload"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm opacity-75">{targetImage.name}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Upload target image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Process Button */}
            <div className="text-center">
              <button
                onClick={processImages}
                disabled={!userImage || (!selectedGif && !targetImage) || isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Demo Face Swap
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result Section */
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Your Face Swap Result</h2>
            <div className="max-w-md mx-auto">
              <img
                src={result}
                alt="Face swap result"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={downloadResult}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={resetApp}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;