from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect 
from models.herbs import herbs

def home(request):
    data=herbs()
    return render(request, "index.html", {"herbs":data})

//def herb(request):
    //return render(request, "herbs.html")
