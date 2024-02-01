class ApplicationController < ActionController::Base
  before_action :anonymous_user

  private

  def anonymous_user
    @anonymous_user ||= AnonymousUser.find_or_create_by(uuid: anonymous_user_id_from_cookies)
  end

  def anonymous_user_id_from_cookies
    anonymous_user_id = request.cookies["anonymous_user_id"]
    if !anonymous_user_id || anonymous_user_id.empty?
      response.set_cookie("anonymous_user_id", value: SecureRandom.uuid, expires: 1.year.from_now)
    else
      anonymous_user_id
    end
  end
end
