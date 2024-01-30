class Api::V1::FilesController < ApiBaseController
  include SupabaseHelper

  def create
    file = UserFile.new(create_params)
    file.anonymous_users_id = @anonymous_user.id
    file.save!
    render json: file

    ProcessFileJob.perform_later(file.id)
  end

  def presigned_url
    response = supabase_request(
      path: "/storage/v1/object/upload/sign/user_files/#{SecureRandom.uuid}",
      method: :post
    )

    render json: {url: response["url"]}
  end

  private

  def create_params
    params.permit(:file_name, :bucket_path)
  end
end
