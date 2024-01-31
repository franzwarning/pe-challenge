class Api::V1::Webhooks::SupabaseController < ActionController::API
  def create
    file = UserFile.find_by(bucket_path: webhook_params[:name])
    file.uploaded = true
    file.save!
    render json: {message: "ok"}
  end

  private

  def webhook_params
    params.require(:record).permit(:name)
  end
end
