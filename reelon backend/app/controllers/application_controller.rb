class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  # Skip CSRF protection for API requests
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  
  # Handle API errors
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  
  private
  
  def not_found
    render json: { error: 'Resource not found' }, status: :not_found
  end
end
