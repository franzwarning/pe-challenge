class UserToFiles < ActiveRecord::Migration[7.1]
  def change
    add_reference :user_files, :anonymous_users, foreign_key: true, null: false
  end
end
