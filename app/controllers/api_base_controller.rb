class ApiBaseController < ActionController::API
  before_action :authenticate_user
  wrap_parameters false

  private

  def authenticate_user
    @anonymous_user = AnonymousUser.find_or_create_by(uuid: anonymous_user_id_from_cookies)
    if @anonymous_user.nil?
      unauthorized
    end
  end

  def anonymous_user_id_from_cookies
    anonymous_user_id = request.cookies["anonymous_user_id"]
    if !anonymous_user_id || anonymous_user_id.empty?
      unauthorized
    else
      anonymous_user_id
    end
  end

  def unauthorized
    render json: {error: "Unauthorized"}, status: :unauthorized
  end
end
