import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebcamCapture } from '../../components/ui/Webcam';
import AppIcon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { analyzeDermaScanImage } from '../../utils/gemini';
import { useUserDataContext } from '../../contexts/UserDataContext.jsx';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../config';
import DotOverlay from '../../components/ui/DotOverlay';

// --- Utility Components ---

// Card Component (Light Aero Panel with Floating Shadow)
const Card = ({ children, className, iconBg, iconBgClass }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-800 ${className}`}>
        {iconBg && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-gray-200 ${iconBgClass || ''}`}>
                <AppIcon name={iconBg} className="w-full h-full" />
            </div>
        )}
        <div className="relative z-10">
            {children}
        </div>
    </motion.div>
);

// ScoreCircle Component (Main overall score - Monochrome Gauge)
const ScoreCircle = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (score / 100) * circumference;
    const accentColor = '#475569'; // Dark Slate Accent

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200" // Light track
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <motion.circle
                        style={{ color: accentColor }} 
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
                <motion.span 
                    initial={{opacity: 0}} 
                    animate={{opacity:1, transition: {delay: 0.5}}} 
                    className="font-heading absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-slate-700">
                    {score}
                </motion.span>
            </div>
            <p className="mt-3 font-semibold text-lg text-gray-700">{label}</p>
        </div>
    );
};

// ScoreBar Component (For detailed metrics)
const ScoreBar = ({ score, label, color, analysis }) => {
    const barColor = color || '#475569'; // Dark Slate Accent

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-heading font-semibold text-sm text-gray-800 flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: barColor }}></span>
                    {label}
                </h4>
                <span className={`font-bold text-sm text-slate-700`}>{score}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${score}%`, backgroundColor: barColor }} 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1 }}
                />
            </div>
            <p className="text-xs text-gray-600 mt-2">{analysis}</p>
        </div>
    );
};


// --- Tabbed Section Component (Actionable items) ---
const TabSection = ({ analysis }) => {
    const [activeTab, setActiveTab] = useState('recommendations');

    if (!analysis) return null; 

    const TABS = [
        { id: 'recommendations', label: 'Recommended Routine', icon: 'Lightbulb' },
        { id: 'legend', label: 'Concern Map', icon: 'MapPin' },
    ];

    // Helper to render the Recommendations Tab
    const renderRecommendations = () => (
        <div className="space-y-4">
            {analysis.recommendations?.length > 0 ? (
                analysis.recommendations.map((rec, index) => (
                    <motion.div key={index} 
                        whileHover={{ scale: 1.01, backgroundColor: '#f3f4f6'}} 
                        className="bg-white p-4 rounded-md cursor-pointer transition-colors duration-200 border border-gray-200 shadow-sm"
                    >
                        <h4 className="font-heading font-bold text-gray-800 flex items-center">
                            <AppIcon name="CheckCircle" className="w-5 h-5 mr-2.5 text-slate-600"/>{rec.title}
                        </h4> 
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </motion.div>
                ))
            ) : (
                <p className="text-gray-600 p-4 text-center">No specific recommendations generated at this time.</p>
            )}
        </div>
    );

    // Helper to render the Concern Map Tab (Legend)
    const renderConcernMap = () => (
        <div className="space-y-4">
            <h4 className="font-heading font-bold text-gray-800 mb-3">Targeted Zones:</h4>
            <div className="flex flex-wrap gap-3">
                {analysis.concernAreas?.length > 0 ? (
                    analysis.concernAreas.map((area, index) => (
                       
                        <div key={index}
                             className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg py-1 px-3 text-sm shadow-sm break-all"
                        >
                            <span className="border border-gray-400 text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gray-200">
                                {index + 1}
                            </span>
                            <p className="text-gray-800 font-medium">{area.concern}</p> 
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 p-4 text-center">No localized data points found.</p>
                )}
            </div>
        </div>
    );


    return (
        <Card className="p-6">
            {/* Tabs Navigation - All Light/Gray Tones */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-md shadow-inner border border-gray-200 mb-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-2 flex items-center justify-center font-semibold text-sm rounded-md transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-white text-gray-800 shadow-md border border-gray-300'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <AppIcon name={tab.icon} className="w-4 h-4 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'recommendations' && renderRecommendations()}
                {activeTab === 'legend' && renderConcernMap()}
            </div>
        </Card>
    );
};


// --- DermaScanPage Component (Main App Logic) ---
const DermaScanPage = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const webcamRef = useRef(null);
    const { user, updateUserData } = useUserDataContext();

    const startCapture = () => setIsCapturing(true);
    const cancelCapture = () => setIsCapturing(false);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot({ screenshotQuality: 1 });
            setCapturedImage(imageSrc);
            setAnalysis(null);
            setError(null);
            setIsCapturing(false);
        }
    }, [webcamRef]);

    const handleScan = async () => {
        if (!capturedImage) return;
        setIsLoading(true);
        setError(null);
        try {
            const imageBlob = await fetch(capturedImage).then(res => res.blob());
            const analysisResult = await analyzeDermaScanImage(imageBlob);
            
            const formData = new FormData();
            formData.append('file', imageBlob);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'derma-scans');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (!response.ok) throw new Error('Cloudinary image upload failed');
            
            const cloudinaryData = await response.json();
            const imageUrl = cloudinaryData.secure_url;

            const scanData = {
                analysis: analysisResult,
                imageUrl,
                createdAt: serverTimestamp(),
                ...(user && { userId: user.uid }) 
            };
            
            await addDoc(collection(db, user ? 'derma-scans' : 'anonymous-derma-scans'), scanData);
            
            if (user) {
                await updateUserData({ dermaScanCompleted: true });
            }

            setAnalysis(analysisResult);
        } catch (err) {
            console.error("Error during scan process:", err);
            setError("Failed to complete the scan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetScan = () => {
        setCapturedImage(null);
        setAnalysis(null);
        setError(null);
        setIsCapturing(false);
    };

    const renderAnalysisContent = () => {
        if (!analysis || !analysis.analysis) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center">
                    <Card className="p-8">
                        <AppIcon name="AlertTriangle" size={48} className="mx-auto text-amber-600 mb-4" /> 
                        <h2 className="font-heading text-2xl font-bold mb-2">Analysis Incomplete</h2>
                        <p className="text-gray-800">
                            The AI couldn't fully analyze the image. Please try retaking the photo in better, more direct lighting.
                        </p>
                        <Button onClick={resetScan} variant="outline" className="mt-6">
                            <AppIcon name="RefreshCw" className="mr-2" /> Retry Scan
                        </Button>
                    </Card>
                </motion.div>
            );
        }

        // --- Data Extraction & Filtering ---
        const detailedAnalysis = { ...analysis.analysis };
        const skinTypeKey = Object.keys(detailedAnalysis).find(key => 
            key.toLowerCase().replace(/[\s_-]/g, '') === 'skintype'
        );
        let skinTypeData = skinTypeKey ? detailedAnalysis[skinTypeKey] : null;
        if (skinTypeKey) delete detailedAnalysis[skinTypeKey];
        
        let skinTypeDisplayValue = (skinTypeData && typeof skinTypeData === 'object' && skinTypeData.type) ? skinTypeData.type : 'N/A';
        // --- End Data Extraction ---

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-800">SKIN <span className="text-slate-600">ANALYSIS</span></h1>
                    <Button onClick={resetScan} variant="outline" className="border-slate-500 text-slate-600 hover:bg-gray-100">
                        <AppIcon name="RefreshCw" className="mr-2" /> New Scan
                    </Button>
                </div>

                {/* ------------------ 3-COLUMN STRUCTURE ------------------ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* COLUMN 1: VISUAL CORE (Image & Age) */}
                    <div className="md:col-span-1 space-y-6">
                        
                        {/* Captured Image Preview - Vertical Aspect Ratio */}
                        <Card className="relative overflow-hidden p-0">
                            {/* FIX: Set img to w-full h-full object-cover, and remove redundant wrapper */}
                            <img
                                src={capturedImage}
                                alt="Captured skin"
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Markers on the image (Now correctly positioned relative to the Card's bounds) */}
                            {analysis.concernAreas && analysis.concernAreas.map((area, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 + index * 0.1 } }}
                                    style={{ 
                                        left: `${area.x}%`, 
                                        top: `${area.y}%`, 
                                        position: 'absolute' 
                                    }}
                                    title={area.concern}
                                    className="w-6 h-6 border-2 border-gray-500 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 bg-black/50 cursor-pointer text-white text-xs font-bold" 
                                >
                                    {index + 1}
                                </motion.div>
                            ))}
                        </Card>
                        
                        {/* Estimated Age Card - MOVED UP */}
                         <Card className="p-6 text-center" 
                            iconBg="Clock" 
                            iconBgClass="text-[180px] -rotate-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <h3 className="font-heading font-semibold text-base text-gray-700 mb-2">
                                Estimated Skin Age
                            </h3>
                            <p className="text-5xl font-heading font-bold text-slate-600">{analysis.skinAge || 'N/A'}</p>
                            <p className="text-xs text-gray-600 mt-1">Estimated age based on visible deterioration.</p>
                        </Card>
                    </div>

                    {/* COLUMN 2: DETAILED METRICS (Overall Score & Breakdown) */}
                    <div className="md:col-span-1 space-y-6">
                        
                        {/* Overall Score Card - INCREASED PADDING TO P-8 */}
                        <Card className="p-8 h-64 flex flex-col justify-center items-center" 
                            iconBg="HeartHandshake" 
                            iconBgClass="text-[200px] -rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <ScoreCircle score={analysis.skinHealth || 0} label="Overall Health Score" />
                            <div className="mt-4 text-center">
                                <h3 className="font-heading font-bold text-lg text-gray-700">
                                    Skin Type: <span className="text-slate-600">{skinTypeDisplayValue}</span>
                                </h3>
                            </div>
                        </Card>

                        {/* Metrics Breakdown */}
                        {Object.keys(detailedAnalysis).length > 0 && (
                             <Card className="p-6">
                                <h3 className="font-heading font-bold text-xl text-slate-600 mb-4">Metric Breakdown</h3>
                                <div className="space-y-3">
                                    {Object.entries(detailedAnalysis).map(([key, value]) => (
                                        <ScoreBar 
                                            key={key} 
                                            score={value.score || 0} 
                                            label={key} 
                                            color="#475569" // Dark Slate
                                            analysis={value.analysis} 
                                        />
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* COLUMN 3: ACTIONABLE PLAN (Insights & Tabs) */}
                    <div className="md:col-span-1 space-y-6">
                        
                        {/* Key Insights */}
                        {analysis.keyInsights && analysis.keyInsights.length > 0 && (
                            <Card className="p-4">
                                <h3 className="font-heading font-semibold text-base mb-3 text-slate-600 border-b border-gray-200 pb-2">
                                    <AppIcon name="Sparkles" size={16} className="mr-2 text-amber-600" />
                                    Key Findings
                                </h3>
                                <div className="space-y-3">
                                    {analysis.keyInsights.map((insight, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <AppIcon name={insight.icon} className={`w-4 h-4 mt-0.5 flex-shrink-0 ${insight.type === 'warning' ? 'text-red-600' : 'text-green-600'}`} />
                                            <p className="text-sm text-gray-700">{insight.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                        
                         {/* Tabbed Recommendations and Legend - ALL LIGHT MODE NOW */}
                         <TabSection analysis={analysis} />
                    </div>
                </div>
                {/* ------------------ END 3-COLUMN STRUCTURE ------------------ */}
            </motion.div>
        )
    };

    return (
        <div className="min-h-screen text-gray-800 bg-gray-50 overflow-x-hidden">
            <div className="container mx-auto px-4 py-12">

                <AnimatePresence>{isCapturing && (
                    <motion.div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Fullscreen Capture Container */}
                        <div className="w-screen h-screen flex items-center justify-center">
                            <div className="w-full max-w-4xl h-full bg-black rounded-lg overflow-hidden shadow-2xl">
                                <WebcamCapture ref={webcamRef} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute bottom-8 flex space-x-4">
                            <Button onClick={capture} size="lg" className="w-24 h-24 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                                <AppIcon name="Camera" size={40} />
                            </Button>
                        </div>
                        <Button onClick={cancelCapture} className="absolute top-4 right-4 bg-gray-700/80 rounded-full w-12 h-12 flex items-center justify-center" variant="ghost">
                            <AppIcon name="X" className="text-white" />
                        </Button>
                    </motion.div>
                )}</AnimatePresence>

                <div className="max-w-7xl mx-auto">
                    {!analysis && !capturedImage && (
                        <motion.div layout initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                            <h1 className="font-heading text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-gray-800 mb-4">SKIN ANALYZER</h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Initiate professional skin diagnosis using device camera.</p>
                            <Button onClick={startCapture} size="lg" className="text-lg px-8 py-4 rounded-full shadow-lg border border-slate-500 bg-gray-200 hover:bg-gray-300 text-slate-700 transform hover:scale-105 transition-all duration-300">
                                <AppIcon name="Scan" className="mr-3" />
                                START SCAN
                            </Button>
                        </motion.div>
                    )}

                    {(capturedImage && !analysis) && (
                        <motion.div layout className="text-center flex flex-col items-center">
                            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">Image Capture Complete</h2>
                            <p className="text-gray-600 mb-8">Ready for spectral processing.</p>
                            <div className="relative w-full max-w-lg mx-auto rounded-lg shadow-2xl border border-gray-300 mb-10 overflow-hidden">
  <img
    src={capturedImage}
    alt="Captured skin"
    className="w-full h-auto object-cover"
  />
  {isLoading && (
    <DotOverlay width={500} height={500} />
  )}
</div>                            <div className="flex justify-center space-x-4">
                                <Button onClick={resetScan} variant="outline" className="w-44 border-gray-400 text-gray-600 hover:bg-gray-400">
                                    <AppIcon name="Trash2" className="mr-2" />
                                    Reset Capture
                                </Button>
                                <Button onClick={handleScan} className="w-44 shadow-lg border border-slate-500 bg-slate-900 hover:bg-slate-700 text-white" disabled={isLoading}>
                                    {isLoading ? (
                                        <><AppIcon name="Loader" className="mr-2 animate-spin" />ANALYZING...</>
                                    ) : (
                                        <><AppIcon name="ScanSearch" className="mr-2" />PROCESS DATA NOW</>
                                    )}
                                </Button>
                            </div>
                            {error && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="bg-red-100 text-red-700 p-4 rounded-lg text-center mt-8 max-w-lg mx-auto border border-red-300">
                                    {error}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {analysis && renderAnalysisContent()}
                </div>
            </div>
        </div>
    );
};

export default DermaScanPage;
