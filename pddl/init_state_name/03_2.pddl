(define (problem scene1)
  (:domain manip)
  (:objects
    banana_1 banana_2 potato garlic - item
    blue basket - container
  )
  (:init
    (ontable banana_1)
    (ontable banana_2)
    (ontable potato)
    (ontable garlic)
    (ontable blue basket)
    (clear banana_1)
    (clear banana_2)
    (clear potato)
    (clear garlic)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)