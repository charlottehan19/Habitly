{activeTab === 'nutrition' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 text-teal-950 tracking-wide">Smart AI Food & Nutrition Scanner</h1>
                  <p className="text-xs text-slate-500">Powered by real Gemini Vision API analysis!</p>
                </div>

                <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm max-w-xl space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-teal-900">Gemini API Key</label>
                    <input 
                      type="password" 
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="Paste your API key here..."
                      className="w-full px-3 py-2 bg-teal-50/30 border border-teal-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 font-mono"
                    />
                  </div>

                  <div className="border-2 border-dashed border-teal-200 rounded-2xl p-6 bg-teal-50/30 flex flex-col items-center justify-center space-y-3 text-center">
                    {selectedImage ? (
                      <div className="flex flex-col items-center space-y-3 w-full">
                        <img src={selectedImage} alt="Meal Preview" className="w-48 h-48 object-cover rounded-xl shadow-md border border-teal-200" />
                        <label htmlFor="meal-image-input" className="text-xs text-teal-700 font-bold underline cursor-pointer">
                          Change photo
                        </label>
                      </div>
                    ) : (
                      <>
                        <span className="text-4xl">🥗</span>
                        <p className="text-xs font-bold text-teal-900">Upload or Snap a Meal Photo</p>
                        <label htmlFor="meal-image-input" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all inline-block">
                          Choose or Take Photo 📸
                        </label>
                      </>
                    )}

                    <input 
                      id="meal-image-input"
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </div>

                  {selectedImage && !scanResult && (
                    <button 
                      onClick={runSmartAiScan}
                      disabled={isScanning}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>✨</span> {isScanning ? 'Calling Gemini Vision API...' : 'Run Real AI Vision Analysis'}
                    </button>
                  )}

                  {scanResult && (
                    <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 text-left text-xs space-y-1.5 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-teal-950 text-sm">✨ Gemini Vision Result</p>
                        <span className="text-[10px] bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded font-mono">Confidence: {scanResult.aiConfidence}</span>
                      </div>
                      <p className="font-semibold text-teal-900 text-sm">{scanResult.item}</p>
                      <p className="text-slate-700"><strong>Calories:</strong> {scanResult.calories}</p>
                      <p className="text-slate-700"><strong>Protein:</strong> {scanResult.protein}</p>
                      <p className="text-teal-800 font-semibold"><strong>Health Score:</strong> {scanResult.healthScore}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
