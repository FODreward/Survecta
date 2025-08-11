import { useQuery } from '@tanstack/react-query';
import { type Survey } from "@shared/schema";

interface AvailableSurveysProps {
  onReturnToDashboard: () => void;
  showReturnButton?: boolean;
}

export default function AvailableSurveysSection({
  onReturnToDashboard,
  showReturnButton = true,
}: AvailableSurveysProps) {
  const { data: surveys, isLoading, error } = useQuery<Survey[]>({
    queryKey: ["/api/surveys"],
  });

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-lg">
          Loading exciting surveys for you...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px] text-red-500 text-lg">
          Failed to load surveys. Please try again.
        </div>
      </div>
    );
  }

  const availableSurveys = surveys?.filter(survey => survey.isActive) || [];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <span>🎉</span>
          <span>Available Surveys</span>
        </h3>
        {showReturnButton && (
          <button 
            onClick={onReturnToDashboard}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        )}
      </div>

      {availableSurveys.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-lg">
          No new surveys available at the moment. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSurveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-xl text-gray-900 mb-2">{survey.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{survey.description || "No description provided."}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-lg font-semibold text-indigo-600">
                  Reward: <strong>{survey.reward} pts</strong>
                </p>
                <button className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75">
                  <span>Take Survey</span>
                  <i className="fas fa-external-link-alt ml-2"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
