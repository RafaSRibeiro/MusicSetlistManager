<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
class ChangeSlideController extends AbstractController
{
    #[Route('/change-slide', name: 'change-slide')]
    public function __invoke(Request $request, HubInterface $hub): Response
    {
        $content = json_decode($request->getContent(), true);
        $slideIndex = $content['slideIndex'];
        $topic = $content['topic'];
        $update = new Update(
            $topic,
            json_encode(['slideIndex' => $slideIndex])
        );

        $hub->publish($update);

        return new Response('published!');
    }
}
