class ApiBaseController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    @anonymous_user = AnonymousUser.find_or_create_by(uuid: anonymous_user_id_from_headers)
    if @anonymous_user.nil?
      unauthorized
    end
  end

  def anonymous_user_id_from_headers
    anonymous_user_id = request.headers["X-Anonymous-User-Id"]
    if anonymous_user_id.empty?
      unauthorized
    else
      anonymous_user_id
    end
  end

  def unauthorized
    render json: {error: "Unauthorized"}, status: :unauthorized
  end
end
