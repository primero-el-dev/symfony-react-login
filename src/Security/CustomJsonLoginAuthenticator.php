<?php

namespace App\Security;

use Symfony\Component\Security\Http\Authenticator\JsonLoginAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyAccess\Exception\AccessException;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Contracts\Service\Attribute\Required;

class CustomJsonLoginAuthenticator extends JsonLoginAuthenticator
{
    private const CSRF_TOKEN_KEY = '_csrf_token';

    private CsrfTokenManagerInterface $csrfTokenManager;

    public function authenticate(Request $request): Passport
    {
        $request->setRequestFormat('json');

        // Check only CSRF token. If valid, pass request to parent
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            throw new BadRequestHttpException('Invalid JSON.');
        }

        if (!array_key_exists(self::CSRF_TOKEN_KEY, $data)) {
            throw new BadRequestHttpException(sprintf('The key "%s" must be provided.', self::CSRF_TOKEN_KEY));
        }
        if (!$token = $data[self::CSRF_TOKEN_KEY]) {
            throw new BadRequestHttpException(sprintf('The key "%s" must be a string.', self::CSRF_TOKEN_KEY));
        }
        
        $csrfToken = new CsrfToken('authenticate', $token);
        if (!$this->csrfTokenManager->isTokenValid($csrfToken)) {
            throw new BadRequestHttpException('Wrong CSRF token.');
        }

        return parent::authenticate($request);
    }

    #[Required]
    public function setCsrfTokenManager(CsrfTokenManagerInterface $csrfTokenManager): void
    {
        $this->csrfTokenManager = $csrfTokenManager;
    }
}