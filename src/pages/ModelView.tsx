
import { useParams } from "react-router-dom";
import ModelViewer from "@/components/ModelViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const models = [
  {
    id: "earth-layers",
    title: "Earth Layers",
    description: "Explore the internal structure of Earth including crust, mantle, outer core, and inner core with detailed cross-sectional views.",
    category: "Geography",
    difficulty: "Beginner"
  },
  {
    id: "prokaryotes-eukaryotes",
    title: "Prokaryotes & Eukaryotes Cell",
    description: "Compare and contrast the cellular structures of prokaryotic and eukaryotic cells with interactive 3D models.",
    category: "Biology",
    difficulty: "Intermediate"
  },
  {
    id: "root-structure",
    title: "Root Structure",
    description: "Discover the anatomy of plant root systems including primary and secondary growth structures.",
    category: "Botany",
    difficulty: "Intermediate"
  },
  {
    id: "blood-components",
    title: "Components of Blood",
    description: "Learn about red blood cells, white blood cells, platelets, and plasma through detailed 3D visualization.",
    category: "Biology",
    difficulty: "Beginner"
  },
  {
    id: "harappa-stamp",
    title: "Harappa Stamp",
    description: "Examine ancient Indus Valley civilization seals and stamps with intricate designs and undeciphered scripts.",
    category: "Archaeology",
    difficulty: "Advanced"
  },
  {
    id: "priest-king",
    title: "Priest King Mohenjodaro",
    description: "Study the famous Priest-King sculpture from Mohenjo-daro, showcasing Indus Valley artistic excellence.",
    category: "Archaeology",
    difficulty: "Advanced"
  },
  {
    id: "varaha",
    title: "Varaha",
    description: "Explore the Hindu deity Varaha avatar sculpture with detailed religious and cultural significance.",
    category: "Culture",
    difficulty: "Intermediate"
  }
];

const ModelView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const model = models.find(m => m.id === id);
  
  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-8">The requested 3D model could not be found.</p>
          <Button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    );
  }

  const modelPath = `/models/${model.id}.glb`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Models</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{model.title}</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Model Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ModelViewer modelPath={modelPath} title={model.title} />
            </div>
          </div>

          {/* Model Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Model</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{model.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <span className="text-sm text-gray-900">{model.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                  <span className="text-sm text-gray-900">{model.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span>Click & Drag</span>
                </div>
                <div className="flex justify-between">
                  <span>Zoom:</span>
                  <span>Mouse Wheel</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan:</span>
                  <span>Right Click & Drag</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelView;
