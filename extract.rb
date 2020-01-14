require 'json'

f = File.binread 'mappings.wasm'
puts f.unpack('C*').to_json
