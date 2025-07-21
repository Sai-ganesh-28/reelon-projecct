module Api
  class ApiController < ActionController::API
    include Authenticable
    
    # Handle API errors
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
    
    private
    
    def not_found
      render json: { error: 'Resource not found' }, status: :not_found
    end
  end
end
