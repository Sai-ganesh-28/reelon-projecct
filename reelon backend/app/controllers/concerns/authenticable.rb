module Authenticable
  extend ActiveSupport::Concern
  
  included do
    before_action :authenticate_user
    
    attr_reader :current_user
  end
  
  private
  
  def authenticate_user
    token = extract_token
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless token
    
    decoded = JwtService.decode(token)
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless decoded
    
    @current_user = User.find_by(id: decoded[:user_id])
    render json: { error: 'User not found' }, status: :unauthorized unless @current_user
  end
  
  def extract_token
    header = request.headers['Authorization']
    header&.split(' ')&.last
  end
end
