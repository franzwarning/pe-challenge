class UserFile < ApplicationRecord
  belongs_to :anonymous_user, foreign_key: :anonymous_users_id
end
