cmake_minimum_required(VERSION 3.1.8)
project(3dCam)
set(CMAKE_CXX_STANDARD 17)
file(GLOB SOURCES src/*.cpp)

include_directories("${emscripten_dir}/libexec/system/include")
include_directories(include)


set(CMAKE_EXECUTABLE_SUFFIX ".wasm.js")
add_executable(output ${SOURCES})
set_target_properties(output PROPERTIES LINK_FLAGS "--bind -s MODULARIZE=1 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1")
#-g4 --source-map-base https://127.0.0.1:8080/src/wasm/build/ 