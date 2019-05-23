require "sinatra"
require "sinatra-websocket"

class Server < Sinatra::Base
  enable :sessions
  set :colors, ["bg-pink", "bg-dark-pink", "bg-light-green", "bg-light-blue", "bg-purple", "bg-orange"]
  set :sockets, Array.new
  set :bind, "0.0.0.0"

  get "/" do
    erb :index, :locals => { session: session.id }
  end

  get "/socket/:session" do |session|
    request.websocket do |ws|
      ws.onopen do
        color = settings.colors[settings.sockets.count]
        settings.sockets << ws
        ws.send(color)
      end

      ws.onmessage do |msg|
        EM.next_tick { settings.sockets.each { |socket| socket.send(msg) } }
      end

      ws.onclose do
        settings.sockets.delete(ws)
      end
    end
  end
end
