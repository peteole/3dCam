#include <emscripten/bind.h>
#include <emscripten.h>
class Image
{
private:
    unsigned char *data;

public:
    const int width;
    const int height;
    Image(int width, int height, int dataPointer);
    unsigned char getPixelValue(int x, int y, int color);
    void setPixelValue(int x, int y, int color, unsigned char value);
    Image *getSharpnessImage();
    int getData() const { return reinterpret_cast<int>(this->data); }
};

EMSCRIPTEN_BINDINGS(myModule)
{
    emscripten::class_<Image>("Image")
        .constructor<int, int, int>(emscripten::allow_raw_pointers())
        .function("getSharpnessImage", &Image::getSharpnessImage,emscripten::allow_raw_pointers())
        .property("data", &Image::getData)
        .function("getPixelValue", &Image::getPixelValue,emscripten::allow_raw_pointers());
}