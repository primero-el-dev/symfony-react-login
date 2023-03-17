<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class LoginController extends AbstractController
{
    public function __construct(private UrlGeneratorInterface $urlGenerator) {}

    #[Route('/login', name: 'app_login')]
    public function login(): Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('login.html.twig', [
            'apiLoginUri' => $this->urlGenerator->generate('api_login_check', referenceType: UrlGeneratorInterface::ABSOLUTE_URL),
            'redirectUri' => $this->urlGenerator->generate('app_home', referenceType: UrlGeneratorInterface::ABSOLUTE_URL),
        ]);
    }
}
