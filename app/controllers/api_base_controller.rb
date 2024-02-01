class ApiBaseController < ActionController::API
  before_action :anonymous_user
  wrap_parameters false

  private

  def anonymous_user
    @anonymous_user ||= begin
      au = AnonymousUser.find_or_create_by(uuid: anonymous_user_id_from_cookies)
      if au.nil?
        unauthorized
      end
      au
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
