class CreateKey < ActiveRecord::Migration
  def change
    create_table :keys do |t|
      t.string :role, :default => "basic"
      t.belongs_to :site

      t.timestamps
    end

    create_table :sites do |t|
      t.text :io, :default => ""
      t.text :ops, :default => "--- {}\n"
      t.string :state

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Dir.mkdir(File.join(Rails.root, "storage"))
        FileUtils.chmod("og=t,u=rwx", File.join(Rails.root, "storage"))
      end
      dir.down do
        FileUtils.remove_entry_secure(File.join(Rails.root, "storage"))
      end
    end
  end
end
