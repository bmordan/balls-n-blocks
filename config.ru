require_relative "server.rb"

Rack::Handler::Thin.run Server.new, :Port => 3000, :Host => "0.0.0.0"
