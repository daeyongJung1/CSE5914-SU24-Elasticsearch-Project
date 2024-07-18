# syntax=docker/dockerfile:1.4
## the base image to build on
## alpine based images are lightweight, so they should build fast, but they use the musl C library instead of the standard gnu one, so some packages (pandas, tensorflow) won't work
FROM python:3.10-alpine

## create a folder to put your project in, WORKDIR also updates the path for subsequent commands in the Dockerfile
WORKDIR /app

## copy the requirements.txt into /app and install the dependencies (you'll get an error here if you use an alpine base image and a musl intolerant library)
COPY requirements.txt .
RUN pip3 install -r requirements.txt

## copy the rest of your project over
COPY . .

## create a folder to put your project in, WORKDIR also updates the path for subsequent commands in the Dockerfile
WORKDIR /app/app

## exposing the port in the Dockerfile is optional, docker run -p 5000:5000 will also expose it
#EXPOSE 5000

## ENTRYPOINT tells docker that upon startup to run "python3 app.py", format is ["command", "param1", "param2"], and if you're using flags such as "-p 5000:5000", "-p" is one param, "5000:5000" is another
## (you may see examples using "CMD", which should function the same in the basic use)
ENTRYPOINT ["flask", "--app", "allergen_checker", "run", "--host", "0.0.0.0", "-p", "5000"]

#CMD ["python", "allergen_checker.py"]