
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModelViewer from '@/components/ModelViewer';
import { ArrowLeft } from 'lucide-react';

interface ModelInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  detailedInfo: string;
  learningObjectives: string[];
  modelPath: string;
}

const modelData: Record<string, ModelInfo> = {
  "earth-layers": {
    id: "earth-layers",
    title: "Earth Layers",
    description: "Explore the internal structure of Earth including crust, mantle, outer core, and inner core.",
    category: "Geography",
    difficulty: "Beginner",
    detailedInfo: "The Earth consists of four main layers: the crust (outermost solid layer), the mantle (hot, dense rock), the outer core (liquid iron and nickel), and the inner core (solid iron and nickel). This model helps visualize the relative thickness and composition of each layer.",
    learningObjectives: [
      "Identify the four main layers of Earth",
      "Understand the composition of each layer",
      "Compare the relative thickness of different layers",
      "Explain the physical states of each layer"
    ],
    modelPath: "/models/earth-layers.glb"
  },
  "prokaryotes-eukaryotes": {
    id: "prokaryotes-eukaryotes",
    title: "Prokaryotes & Eukaryotes Cell",
    description: "Compare cellular structures of prokaryotic and eukaryotic cells.",
    category: "Biology",
    difficulty: "Intermediate",
    detailedInfo: "This interactive model showcases the fundamental differences between prokaryotic cells (bacteria and archaea) and eukaryotic cells (plants, animals, fungi). Key differences include the presence of a nucleus, organelles, and cell complexity.",
    learningObjectives: [
      "Distinguish between prokaryotic and eukaryotic cells",
      "Identify key cellular organelles",
      "Understand cellular organization differences",
      "Compare cell sizes and complexity"
    ],
    modelPath: "/models/prokaryotes-eukaryotes.glb"
  },
  "root-structure": {
    id: "root-structure",
    title: "Root Structure",
    description: "Discover the anatomy of plant root systems and their functions.",
    category: "Botany",
    difficulty: "Intermediate",
    detailedInfo: "Plant roots serve multiple functions including water and nutrient absorption, anchoring, and storage. This model demonstrates the different types of root systems, root zones, and internal root anatomy including the epidermis, cortex, and vascular cylinder.",
    learningObjectives: [
      "Identify different types of root systems",
      "Understand root anatomy and zones",
      "Explain root functions in plant survival",
      "Recognize root adaptations"
    ],
    modelPath: "/models/root-structure.glb"
  },
  "blood-components": {
    id: "blood-components",
    title: "Components of Blood",
    description: "Learn about blood cells and plasma through detailed 3D visualization.",
    category: "Biology",
    difficulty: "Beginner",
    detailedInfo: "Blood consists of red blood cells (oxygen transport), white blood cells (immune defense), platelets (clotting), and plasma (liquid component). This model shows the relative proportions and functions of each component.",
    learningObjectives: [
      "Identify the four main blood components",
      "Understand the function of each blood component",
      "Recognize blood cell shapes and structures",
      "Explain blood composition percentages"
    ],
    modelPath: "/models/blood-components.glb"
  },
  "harappa-stamp": {
    id: "harappa-stamp",
    title: "Harappa Stamp",
    description: "Examine ancient Indus Valley civilization seals with intricate designs.",
    category: "Archaeology",
    difficulty: "Advanced",
    detailedInfo: "Harappan seals are steatite tablets with carved animals, symbols, and undeciphered script. These artifacts provide insights into Indus Valley trade, religion, and administrative systems from 2500-1900 BCE.",
    learningObjectives: [
      "Analyze Harappan seal iconography",
      "Understand Indus Valley trade systems",
      "Explore ancient writing systems",
      "Connect artifacts to historical context"
    ],
    modelPath: "/models/harappa-stamp.glb"
  },
  "priest-king": {
    id: "priest-king",
    title: "Priest King Mohenjodaro",
    description: "Study the famous Priest-King sculpture showcasing Indus Valley artistry.",
    category: "Archaeology",
    difficulty: "Advanced",
    detailedInfo: "The Priest-King is a limestone sculpture from Mohenjo-daro (c. 2000-1900 BCE) featuring intricate trefoil patterns, a headband, and armband. It represents the sophisticated artistic and cultural achievements of the Indus Valley Civilization.",
    learningObjectives: [
      "Examine Indus Valley artistic techniques",
      "Analyze cultural and religious symbolism",
      "Understand archaeological interpretation methods",
      "Connect art to social structures"
    ],
    modelPath: "/models/priest-king.glb"
  },
  "varaha": {
    id: "varaha",
    title: "Varaha",
    description: "Explore the Hindu deity Varaha avatar with cultural significance.",
    category: "Culture",
    difficulty: "Intermediate",
    detailedInfo: "Varaha is the boar avatar of Vishnu in Hindu mythology, representing the rescue of Earth (personified as Bhudevi) from the cosmic ocean. This sculpture demonstrates classical Indian artistic traditions and religious symbolism.",
    learningObjectives: [
      "Understand Hindu avatar mythology",
      "Analyze religious sculpture symbolism",
      "Explore Indian artistic traditions",
      "Connect mythology to cultural values"
    ],
    modelPath: "/models/varaha.glb"
  }
};

const ModelView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const model = id ? modelData[id] : null;

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Model Not Found</CardTitle>
            <CardDescription>The requested 3D model could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Biology": return "bg-blue-100 text-blue-800";
      case "Geography": return "bg-purple-100 text-purple-800";
      case "Botany": return "bg-green-100 text-green-800";
      case "Archaeology": return "bg-amber-100 text-amber-800";
      case "Culture": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Models
            </Button>
            <div className="text-sm text-gray-500">
              Interactive MM Education
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryColor(model.category)}>
                    {model.category}
                  </Badge>
                  <Badge className={getDifficultyColor(model.difficulty)}>
                    {model.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  {model.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About This Model</h3>
                  <p className="text-gray-600 leading-relaxed">{model.detailedInfo}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {model.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Controls Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-2">🖱️</div>
                    <div className="font-medium text-gray-900">Rotate</div>
                    <div className="text-sm text-gray-600">Click & drag</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="font-medium text-gray-900">Zoom</div>
                    <div className="text-sm text-gray-600">Mouse wheel</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">👆</div>
                    <div className="font-medium text-gray-900">Pan</div>
                    <div className="text-sm text-gray-600">Right click & drag</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3D Model Viewer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive 3D Model</CardTitle>
                <CardDescription>
                  Explore the model using mouse controls. The model will load automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelViewer modelPath={model.modelPath} title={model.title} />
              </CardContent>
            </Card>

            {/* Model Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-blue-600 text-sm font-medium mb-2">
                    📱 Mobile Tip
                  </div>
                  <p className="text-blue-700 text-sm">
                    For the best mobile experience, use pinch gestures to zoom and single finger to rotate the model.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelView;
