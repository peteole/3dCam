#include "Image.h"
Image::Image(int width, int height, int dataPointer) : width(width), height(height)
{
    this->data = reinterpret_cast<unsigned char *>(dataPointer);
}

unsigned char Image::getPixelValue(int x, int y, int color)
{
    return this->data[(x + this->width * y) * 4 + color];
}
void Image::setPixelValue(int x, int y, int color, unsigned char value)
{
    this->data[(x + this->width * y) * 4 + color] = value;
}
Image *Image::getSharpnessImage()
{
    char *newData = new char[width * height*4];
    Image *newImage = new Image(width, height, reinterpret_cast<int>(newData));
    for (int x = 1; x < width - 1; x++)
    {
        for (int y = 1; y < height-1; y++)
        {
            unsigned char difference = 0;
            for (int color = 0; color < 3; color++)
            {
                char myVal = getPixelValue(x, y, color);
                difference += abs(getPixelValue(x + 1, y, color) - myVal) + abs(getPixelValue(x - 1, y, color) - myVal) + abs(getPixelValue(x, y + 1, color) - myVal) + abs(getPixelValue(x, y - 1, color) - myVal);
            }
            for (int color = 0; color < 3; color++)
            {
                newImage->setPixelValue(x, y, color, difference);
            }
            newImage->setPixelValue(x, y, 3, 255);
        }
    }
    return newImage;
}