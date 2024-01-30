class AnonymousUser < ActiveRecord::Migration[7.1]
  def change
    create_table :anonymous_users do |t|
      t.string :uuid, null: false
      t.timestamps
    end
  end
end
